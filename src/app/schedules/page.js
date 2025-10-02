import { Suspense } from 'react';
import SchedulesClientPage from './SchedulesClientPage';
import Loading from './loading'; // Import your loading component

export default function SchedulesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SchedulesClientPage />
    </Suspense>
  );
}