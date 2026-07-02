import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckOutSession = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });

    // old subscriber
    let stripeCustomerId = user.subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      // new subscriber
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;
    }

    console.log("Stripe Price ID:", config.stripe_product_price_id);

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_product_price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/premium?success=true`,
      cancel_url: `${config.app_url}/payment?success=false`,
      metadata: { userId: user.id },
    });

    console.log(session);

    return session.url;
  });

  return {
    paymentUrl: {
      transactionResult,
    },
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  // Handle the event
  switch (event.type) {
    // Occurs when a Checkout Session has been successfully completed.
    case "checkout.session.completed":
      console.log("Webhook Hit");
      console.log(event.data.object);
      const session: Stripe.Checkout.Session = event.data.object;
      const userId = session.metadata?.userId;
      const stripeCustomerId = session.customer;
      const stripeSubscriptionId = session.subscription as string;

      if (!userId || !stripeSubscriptionId || !stripeCustomerId) {
        throw new Error("Webhook Failed");
      }

      const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);


      console.log("sub info", stripeSubscription)

      // const paymentIntent = event.data.object;

      break;

    //Occurs whenever a subscription changes (e.g., switching from one plan to another, or changing the status from trial to active).
    case "customer.subscription.updated":
      // const paymentMethod = event.data.object;

      break;

    //Occurs whenever a customer’s subscription ends.
    case "customer.subscription.deleted":
      break;
    default:
      // Unexpected event type
      console.log(`No Event Matched. Unhandled event type ${event.type}.`);
  }
};

export const subscriptionServices = {
  createCheckOutSession,
  handleWebhook,
};
