import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import AllTools from "./pages/AllTools";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

import PercentageCalculator from "./tools/PercentageCalculator";
import GSTCalculator from "./tools/GSTCalculator";
import AgeCalculator from "./tools/AgeCalculator";
import ImageCompressor from "./tools/ImageCompressor";

import ImageResizer from "./tools/ImageResizer";
import WordCounter from "./tools/WordCounter";
import DiscountCalculator from "./tools/DiscountCalculator";
import ProfitMarginCalculator from "./tools/ProfitMarginCalculator";
import EMICalculator from "./tools/EMICalculator";
import DateDifference from "./tools/DateDifference";
import CBMCalculator from "./tools/CBMCalculator";
import UnitConverter from "./tools/UnitConverter";
import JpgToPdf from "./tools/JpgToPdf";
import MergePdf from "./tools/MergePdf";
import SplitPdf from "./tools/SplitPdf";
import PdfCompressor from "./tools/PdfCompressor";
import PassportPhotoMaker from "./tools/PassportPhotoMaker";
import SignatureResizer from "./tools/SignatureResizer";
import ImageConverter from "./tools/ImageConverter";
import ImageCropper from "./tools/ImageCropper";
import ForeignPaymentCalculator from "./tools/ForeignPaymentCalculator";
function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<AllTools />} />

          <Route
            path="/percentage-calculator"
            element={<PercentageCalculator />}
          />

          <Route
            path="/gst-calculator"
            element={<GSTCalculator />}
          />

          <Route
            path="/age-calculator"
            element={<AgeCalculator />}
          />

          <Route
            path="/image-compressor"
            element={<ImageCompressor />}
          />

          <Route path="/about" element={<About />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          <Route path="*" element={<NotFound />} />
          <Route
  path="/image-resizer"
  element={<ImageResizer />}
/>

<Route
  path="/word-counter"
  element={<WordCounter />}
/>

<Route
  path="/discount-calculator"
  element={<DiscountCalculator />}
/>

<Route
  path="/profit-margin-calculator"
  element={<ProfitMarginCalculator />}
/>

<Route
  path="/emi-calculator"
  element={<EMICalculator />}
/>

<Route
  path="/date-difference"
  element={<DateDifference />}
/>

<Route
  path="/cbm-calculator"
  element={<CBMCalculator />}
/>

<Route
  path="/unit-converter"
  element={<UnitConverter />}
/>
<Route
  path="/jpg-to-pdf"
  element={<JpgToPdf />}
/>
<Route
  path="/merge-pdf"
  element={<MergePdf />}
/>
<Route
  path="/split-pdf"
  element={<SplitPdf />}
/>
<Route
  path="/pdf-compressor"
  element={<PdfCompressor />}
/>
<Route
  path="/passport-photo-maker"
  element={<PassportPhotoMaker />}
/>
<Route
  path="/signature-resizer"
  element={<SignatureResizer />}
/>
<Route
  path="/image-converter"
  element={<ImageConverter />}
/>
<Route
  path="/image-cropper"
  element={<ImageCropper />}
/>
<Route
  path="/foreign-payment-calculator"
  element={<ForeignPaymentCalculator />}
/>
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;