import ScrollToTop from "@/components/common/ScrollToTop";

const BookingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full text-secondary p-8 mt-8 rounded-2xl bg-gradient-to-b from-[#FDD474]/[0.15] to-[#BA8209]/[0.15]">
      <ScrollToTop />
      {children}
    </div>
  );
};

export default BookingLayout;
