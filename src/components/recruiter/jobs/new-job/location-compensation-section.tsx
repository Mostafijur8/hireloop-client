import { JobFormSection } from "./job-form-section";
import { CompensationFields } from "./compensation-fields";
import { WorkLocationFields } from "./work-location-fields";

type LocationCompensationSectionProps = {
  remote: boolean;
  onRemoteChange: (remote: boolean) => void;
};

/** Groups location and compensation inputs in one job form section. */
export function LocationCompensationSection({ remote, onRemoteChange }: LocationCompensationSectionProps) {
  return (
    <JobFormSection title="2. Location, Compensation & Timeline">
      <WorkLocationFields remote={remote} onRemoteChange={onRemoteChange} />
      <CompensationFields />
    </JobFormSection>
  );
}
