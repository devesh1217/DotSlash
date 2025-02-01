import ServiceApplication from '@/components/services/ServiceApplication';

export default function ServiceApplicationPage({ params }) {
  return <ServiceApplication serviceId={params.id} />;
}
