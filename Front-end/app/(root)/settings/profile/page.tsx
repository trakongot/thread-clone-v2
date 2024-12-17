import ContentSection from "../components/content-section";
import ProfileForm from "../components/profile-form";

export default function Page() {
  return (
    <ContentSection
      title="Profile"
      desc="This is how others will see you on the site."
    >
      <ProfileForm />
    </ContentSection>
  );
}