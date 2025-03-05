import React from 'react';
import { ServiceCard } from './servicecard/page';
const VisaServicesSection = () => {
  const services = [
    { name: 'International English Language Testing System', image: '/service-1.jpg' },
    { name: 'Pearson Test of English', image: '/service-2.jpg' },
    { name: 'Duolingo', image: '/service-3.jpg' },
  ];

  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-3xl font-bold mb-10">Ace Your Exams, Unlock Your Future</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10">
        {services.map((service, index) => (
          <ServiceCard key={index} service={service.name} image={service.image} />
        ))}
      </div>
     
    </section>
  );
};

export default VisaServicesSection;
