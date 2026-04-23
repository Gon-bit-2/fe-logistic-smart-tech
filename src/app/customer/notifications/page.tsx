import { redirect } from "next/navigation";

export default function CustomerNotificationsPage() {
  redirect("/overview?notifications=1");
}
