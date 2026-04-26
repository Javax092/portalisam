export function createWhatsAppLink(phone: string, message: string): string {
  const normalizedPhone = phone.replace(/\D/g, "");

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
