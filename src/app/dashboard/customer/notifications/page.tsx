import { redirect } from "next/navigation";

export default function CustomerNotificationsPage() {
  redirect("/dashboard/customer?notifications=1");
}
