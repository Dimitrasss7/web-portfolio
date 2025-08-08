'use client';

import React, { useState } from 'react';
import BlurText from '@/blocks/TextAnimations/BlurText/BlurText'; 
import Squares from '@/blocks/Backgrounds/Squares/Squares';

export default function CreateOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const telegramNick = formData.get('telegramNick')?.toString() || '';
    const orderDescription = formData.get('orderDescription')?.toString() || '';
    const contactInfo = formData.get('contactInfo')?.toString() || '';

    try {
      // Send order to Telegram bot
      const response = await fetch('/api/send-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramNick,
          orderDescription,
          contactInfo,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        form.reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending order:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Section Title */}
      <div className="text-center mb-12 md:mb-16">
        <BlurText
          text="Создать заказ"
          delay={50}
          animateBy="letters"
          direction="top"
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center"
        />
      </div>

      {/* Order Form Container */}
      <div className="w-full max-w-md md:max-w-2xl mx-auto">
        <div className="bg-[#1a1b1c]/50 backdrop-blur-sm border border-white/[.15] rounded-lg p-6 md:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Оформить заказ</h2>

          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-600/20 border border-green-500/30 rounded-md">
              <p className="text-green-400 text-center">✅ Заказ успешно отправлен! Мы свяжемся с вами в ближайшее время.</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-600/20 border border-red-500/30 rounded-md">
              <p className="text-red-400 text-center">❌ Ошибка при отправке заказа. Попробуйте еще раз.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <div>
              <label htmlFor="telegramNick" className="block text-white/80 text-sm font-medium mb-2">
                Ваш ник в Telegram <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                id="telegramNick"
                name="telegramNick"
                placeholder="@ваш_ник"
                className="w-full px-4 py-3 bg-[#1a1b1c] border border-white/[.15] rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-white/40"
                required
              />
              <p className="text-xs text-white/60 mt-1">Например: @montanaX7</p>
            </div>

            <div>
              <label htmlFor="contactInfo" className="block text-white/80 text-sm font-medium mb-2">
                Дополнительные контакты
              </label>
              <input
                type="text"
                id="contactInfo"
                name="contactInfo"
                placeholder="Email или номер телефона (необязательно)"
                className="w-full px-4 py-3 bg-[#1a1b1c] border border-white/[.15] rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-white/40"
              />
            </div>

            <div>
              <label htmlFor="orderDescription" className="block text-white/80 text-sm font-medium mb-2">
                Описание заказа <span className="text-cyan-400">*</span>
              </label>
              <textarea
                id="orderDescription"
                name="orderDescription"
                rows={6}
                placeholder="Подробно опишите что вам нужно создать: тип проекта, функционал, требования, сроки..."
                className="w-full px-4 py-3 bg-[#1a1b1c] border border-white/[.15] rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-white/40 resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-md transition duration-200 ${
                isSubmitting 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black'
              }`}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить заказ'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              После отправки заказа мы свяжемся с вами в Telegram в течение 24 часов
            </p>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full z-[-5] opacity-15">
        <Squares 
          speed={0.5} 
          squareSize={50}
          direction='diagonal'
          borderColor='#fff'
          hoverFillColor='#222'
        />
      </div>
    </main>
  );
}