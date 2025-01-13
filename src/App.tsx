import React, { useState, useRef, useEffect } from 'react';
import { gsap, Power2 } from 'gsap';
import HomeScreen from './components/HomeScreen';
import AboutScreen from './components/AboutScreen';
import ServicesScreen from './components/ServicesScreen';
import ContactScreen from './components/ContactScreen';
import './App.css';

type ScreenType = number; // Индексы экранов: 0, 1, 2, 3

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(0);

  const screens: ScreenType[] = [0, 1, 2, 3];
  const screensRef = useRef<HTMLDivElement[]>([]);

  // Инициализация позиций экранов
  useEffect(() => {
    screensRef.current.forEach((screen, index) => {
      if (index === currentScreen) {
        gsap.set(screen, { y: '0%', opacity: 1 });
      } else if (index < currentScreen) {
        gsap.set(screen, { y: '-100%', opacity: 0 });
      } else {
        gsap.set(screen, { y: '100%', opacity: 0 });
      }
    });
  }, []);

  // Анимация переходов между экранами
  useEffect(() => {
    screensRef.current.forEach((screen, index) => {
      if (index === currentScreen) {
        gsap.to(screen, {
          y: '0%',
          opacity: 1,
          duration: 0.8,
          ease: Power2.easeInOut,
        });
      } else if (index < currentScreen) {
        gsap.to(screen, {
          y: '-100%',
          opacity: 0,
          duration: 0.8,
          ease: Power2.easeInOut,
        });
      } else {
        gsap.to(screen, {
          y: '100%',
          opacity: 0,
          duration: 0.8,
          ease: Power2.easeInOut,
        });
      }
    });
  }, [currentScreen]);

  // Обработчик колесика мыши
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Проверяем, находится ли фокус внутри скроллируемого экрана
      const target = e.target as HTMLElement;
      const isInScrollable = target.closest('.scrollable');
  
      if (isInScrollable) {
        const scrollableElement = target.closest('.scrollable') as HTMLElement;
        // Проверяем, можно ли скроллить дальше в направлении прокрутки
        const canScroll =
          (e.deltaY > 0 && scrollableElement.scrollTop + scrollableElement.clientHeight < scrollableElement.scrollHeight) ||
          (e.deltaY < 0 && scrollableElement.scrollTop > 0);
  
        if (canScroll) {
          // Разрешаем стандартное поведение скролла внутри элемента
          return;
        }
      }
  
      e.preventDefault(); // Предотвращаем стандартное поведение прокрутки страницы
  
      if (e.deltaY > 0) {
        // Скролл вниз
        setCurrentScreen((prev) => Math.min(prev + 1, screens.length - 1));
      } else {
        // Скролл вверх
        setCurrentScreen((prev) => Math.max(prev - 1, 0));
      }
    };
  
    window.addEventListener('wheel', handleWheel, { passive: false });
  
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Обработчики тач-событий
  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;
    let isInScrollable = false;
    let scrollableElement: HTMLElement | null = null;
  
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.changedTouches[0].screenY;
      const target = e.target as HTMLElement;
      scrollableElement = target.closest('.scrollable') as HTMLElement | null;
      isInScrollable = !!scrollableElement;
    };
  
    const handleTouchMove = (e: TouchEvent) => {
      if (isInScrollable && scrollableElement) {
        const deltaY = touchStartY - e.changedTouches[0].screenY;
        const canScroll =
          (deltaY > 0 && scrollableElement.scrollTop + scrollableElement.clientHeight < scrollableElement.scrollHeight) ||
          (deltaY < 0 && scrollableElement.scrollTop > 0);
  
        if (canScroll) {
          // Разрешаем стандартное поведение скролла внутри элемента
          return;
        }
      }
      e.preventDefault(); // Предотвращаем прокрутку страницы
    };
  
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndY = e.changedTouches[0].screenY;
      handleGesture();
    };
  
    const handleGesture = () => {
      const deltaY = touchStartY - touchEndY;
      if (Math.abs(deltaY) > 50) {
        if (isInScrollable && scrollableElement) {
          const canScroll =
            (deltaY > 0 && scrollableElement.scrollTop + scrollableElement.clientHeight < scrollableElement.scrollHeight) ||
            (deltaY < 0 && scrollableElement.scrollTop > 0);
  
          if (canScroll) {
            // Разрешаем стандартное поведение скролла внутри элемента
            return;
          }
        }
  
        if (deltaY > 0) {
          // Свайп вверх
          setCurrentScreen((prev) => Math.min(prev + 1, screens.length - 1));
        } else {
          // Свайп вниз
          setCurrentScreen((prev) => Math.max(prev - 1, 0));
        }
      }
    };
  
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="app">
      <div className="screens">
        {screens.map((_, index) => (
          <div
            key={index}
            className="screen-container"
            ref={(el) => {
              if (el) screensRef.current[index] = el;
            }}
          >
             {index === 0 && <HomeScreen/>}
          {index === 1 && <AboutScreen isActive={currentScreen === index} />}
          {index === 2 && <ServicesScreen />}
          {index === 3 && <ContactScreen />}
          </div>
        ))}
      </div>
      <div className="navigation">
        <button onClick={() => setCurrentScreen(0)}>Главная</button>
        <button onClick={() => setCurrentScreen(1)}>О нас</button>
        <button onClick={() => setCurrentScreen(2)}>Услуги</button>
        <button onClick={() => setCurrentScreen(3)}>Контакты</button>
      </div>
    </div>
  );
};

export default App;