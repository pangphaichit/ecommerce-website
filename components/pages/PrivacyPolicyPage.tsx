import React from "react";
import NotificationBar from "../landing-page-components/NotificationBar";
import Navbar from "../Navbar";
import PrivacyPolicySection from "../../components/privacy-policy-page-components/PrivacyPolicySection";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      <NotificationBar />
      <Navbar />
      <PrivacyPolicySection />
    </div>
  );
};

export default PrivacyPolicyPage;
