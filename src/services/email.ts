// Email service for sending transactional emails
export interface EmailData {
  to: string;
  subject: string;
  template: 'order-confirmation' | 'class-purchase' | 'class-reminder' | 'zoom-link';
  data: Record<string, any>;
}

export const emailService = {
  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // TODO: Replace with actual API endpoint (Laravel backend)
      const response = await fetch('/api/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Email sending error:', error);
      return false;
    }
  },

  // Send order confirmation email
  async sendOrderConfirmation(order: any): Promise<boolean> {
    return this.sendEmail({
      to: order.email,
      subject: 'Order Confirmation - Blossom Fitness Hub',
      template: 'order-confirmation',
      data: {
        orderId: order.id,
        items: order.items,
        total: order.total,
        currency: order.currency,
      },
    });
  },

  // Send class purchase confirmation with Zoom® link
  async sendClassPurchase(purchase: any): Promise<boolean> {
    return this.sendEmail({
      to: purchase.email,
      subject: 'Class Purchase Confirmed - Blossom Fitness Hub',
      template: 'class-purchase',
      data: {
        className: purchase.className,
        date: purchase.date,
        time: purchase.time,
        zoomLink: purchase.zoomLink,
        zoomPassword: purchase.zoomPassword,
      },
    });
  },

  // Send class reminder (24 hours before)
  async sendClassReminder(classInfo: any): Promise<boolean> {
    return this.sendEmail({
      to: classInfo.email,
      subject: 'Class Reminder - Tomorrow at ' + classInfo.time,
      template: 'class-reminder',
      data: {
        className: classInfo.className,
        date: classInfo.date,
        time: classInfo.time,
        zoomLink: classInfo.zoomLink,
      },
    });
  },

  // Send Zoom® link separately
  async sendZoomLink(recipient: any): Promise<boolean> {
    return this.sendEmail({
      to: recipient.email,
      subject: 'Your Zoom® Link - ' + recipient.className,
      template: 'zoom-link',
      data: {
        className: recipient.className,
        zoomLink: recipient.zoomLink,
        zoomPassword: recipient.zoomPassword,
        date: recipient.date,
        time: recipient.time,
      },
    });
  },
};
