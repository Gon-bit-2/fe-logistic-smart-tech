import { redirect } from "next/navigation";

export default function CustomerNotificationsRoute() {
  redirect("/dashboard/customer?notifications=1");
}
