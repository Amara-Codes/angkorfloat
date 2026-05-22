import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default async function MainLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="bg-custom-celadon dark:bg-custom-blue">
      <Navbar
        className='h-32 md:h-40 max-h-32 md:max-h-40 overflow-hidden'
        locale={locale}
        transparent={true}
        fixed={true}
        threshold={50}
      />
      <div className="mt-32 md:mt-40 grow bg-custom-celadon dark:bg-custom-green transition-colors duration-500">
        {children}
      </div>
      <Footer />
    </div>
  );
}
