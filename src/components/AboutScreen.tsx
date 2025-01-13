import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './AboutScreen.css';

interface AboutScreenProps {
  isActive: boolean;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ isActive }) => {
  const blockRefs = useRef<HTMLDivElement[]>([]);
  const animation = useRef<gsap.core.Timeline | null>(null);

  // Сбрасываем массив refs при каждом рендере
  blockRefs.current = [];

  useEffect(() => {
    if (!animation.current) {
      // Создаём таймлайн с паузой
      animation.current = gsap.timeline({ paused: true })
        .fromTo(
          blockRefs.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6, // Увеличиваем длительность анимации
            stagger: 1,  // Увеличиваем задержку между анимациями блоков
            ease: 'power2.out',
          }
        );
    }

    if (isActive) {
      // Проигрываем анимацию вперёд
      animation.current.play();
    } else {
      // Проигрываем анимацию назад
      animation.current.reverse();
    }
  }, [isActive]);

  return (
    <div className="screen about-screen">
      <h1>О нас</h1>
      <div className="blocks-container">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="info-block"
            ref={(el) => {
              if (el) blockRefs.current[index] = el;
            }}
          >
            <h2>Блок {index + 1}</h2>
            <p>
              Мы — несуществующая киностудия, специализирующаяся на создании удивительных фильмов и сериалов. Наш
              блок {index + 1} рассказывает о наших достижениях и проектах.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutScreen;