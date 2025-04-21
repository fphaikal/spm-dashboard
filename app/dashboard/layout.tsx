import LogoutButton from "@/components/logout-button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-ag-50 to-ag-100 flex flex-col items-center justify-center gap-4 px-10">
      <div className="flex w-full justify-between">
        <img
          src="https://www.astragraphia.co.id/web/images/logo_putih.svg"
          alt=""
          className="w-32" />
        <LogoutButton />
      </div>
      <div className="inline-block text-center">{children}</div>
    </div>
  );
}
