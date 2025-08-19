import Header from "../components/Header";
import Footer from "../components/Footer";
import StepIndicator from "../components/booking/StepIndicator";
import GuestInfoForm from "../components/booking/GuestInfoForm";
import BookingDetailsForm from "../components/booking/BookingDetailsForm";
import PaymentForm from "../components/booking/PaymentForm";
import OrderSummary from "../components/booking/OrderSummary";
import BookingConfirmation from "../components/booking/BookingConfirmation";
import NavigationButtons from "../components/booking/NavigationButtons";
import { useBooking } from "../hooks/useBooking";

const Booking = () => {
  const {
    formData,
    currentStep,
    isSubmitting,
    selectedRoom,
    setCurrentStep,
    handleInputChange,
    handleSubmit,
    calculateTotal
  } = useBooking();

  const pricing = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Đặt phòng</h1>
          <p className="text-gray-600">Hoàn thành thông tin để xác nhận đặt phòng</p>
        </div>

        {currentStep < 4 && <StepIndicator currentStep={currentStep} />}

        {currentStep === 4 ? (
          <BookingConfirmation />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {currentStep >= 1 && (
                  <GuestInfoForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                )}
                {currentStep >= 2 && (
                  <BookingDetailsForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                )}
                {currentStep >= 3 && (
                  <PaymentForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                )}

                <NavigationButtons
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                  formData={formData}
                  isSubmitting={isSubmitting}
                />
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummary
                  selectedRoom={selectedRoom}
                  formData={formData}
                  pricing={pricing}
                />
              </div>
            </div>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Booking;