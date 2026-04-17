import DispatcherDashboardScreen from "@/features/admin/presentation/screens/DispatcherDashboardScreen";

export interface AdminDashboardScreenProps {
  readonly _unused?: never;
}

export default function AdminDashboardScreen(
  _props: Readonly<AdminDashboardScreenProps>,
) {
  void _props;
  return <DispatcherDashboardScreen />;
}

