import React from 'react';

const ServicesScreen: React.FC = () => {
  return (
    <div className="screen services-screen scrollable">
      <h1>Услуги</h1>
      <div className="content">
        {/* Добавим много контента для демонстрации скролла */}
        {Array.from({ length: 50 }, (_, i) => (
          <p key={i}>Значимый контент {i + 1}</p>
        ))}
      </div>
    </div>
  );
};

export default ServicesScreen;