export interface NotificationPlan {
  channels: string[]
  cadenceMinutes: number
  template: string
}

const PLANS: Record<string, NotificationPlan> = {
  created: { channels: ["email"], cadenceMinutes: 1440, template: "order-created" },
  paid: { channels: ["email"], cadenceMinutes: 720, template: "payment-received" },
  processing: { channels: ["email"], cadenceMinutes: 720, template: "order-processing" },
  shipped: { channels: ["sms", "email"], cadenceMinutes: 360, template: "shipment-update" },
  "out-for-delivery": { channels: ["sms", "push"], cadenceMinutes: 60, template: "out-for-delivery" },
  delivered: { channels: ["push", "email"], cadenceMinutes: 0, template: "delivered-confirmation" },
  exception: { channels: ["sms", "push", "email"], cadenceMinutes: 30, template: "exception-alert" },
  delayed: { channels: ["sms", "push", "email"], cadenceMinutes: 30, template: "exception-alert" },
}

export function notificationPlan(status: string): NotificationPlan {
  const key = status.toLowerCase()
  const plan = PLANS[key]
  if (plan) return { channels: [...plan.channels], cadenceMinutes: plan.cadenceMinutes, template: plan.template }
  return { channels: ["email"], cadenceMinutes: 720, template: "status-update" }
}
