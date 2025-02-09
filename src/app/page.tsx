"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  // Etapas:
  // 0 = Animación de flip (de CartaCerrada a CartaAbierta)
  // 1 = Transición combinada (slide, scale y fade) al pasar a la carta final
  // 2 = Contenido interactivo sobre la carta final (Carta.png)
  const [stage, setStage] = useState(0);
  const [hasFlipped, setHasFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Contenido de las páginas de la tarjeta
  const pages = [
    {
      text: "Feliz San Valentín, mi amor. Te amo mucho <3",
      image: "/imagen1.jpeg",
    },

    {
      text: "Eres la persona más importante en mi vida, y quiero que sepas que siempre estaré a tu lado.",
      image: "/imagen2.jpeg",
    },
    {
      text: "Pronto serás mi esposa, así que es un buen momento para recordar lo vivido hasta ahora.",
      image: "/imagen3.jpeg",
    },
    {
      text: "",
      youtube: "https://youtu.be/v-xzJb9eQIg", // Reemplaza VIDEO_ID por el id real del video
    },
  ];

  // Función para avanzar en las páginas del contenido
  const handleContentClick = () => {
    if (pageIndex < pages.length - 1) {
      setPageIndex(pageIndex + 1);
    }
  };

  // Función para alternar el audio de fondo
  const toggleMute = () => {
    setIsMuted((prevMuted) => {
      const newMuted = !prevMuted;

      if (audioRef.current) {
        if (newMuted) {
          audioRef.current.pause();
        } else {
          audioRef.current
            .play()
            .catch((err) => console.error("Error reproduciendo audio:", err));
        }
      }

      return newMuted;
    });
  };

  // Cuando se llegue al stage 2, se ejecuta toggleMute automáticamente
  useEffect(() => {
    if (stage === 1) {
      toggleMute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  useEffect(() => {
    if (stage === 2 && pages[pageIndex].youtube) {
      toggleMute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, pageIndex]);

  return (
    <div className="relative h-screen bg-gradient-to-br from-pink-300 to-purple-500 flex items-center justify-center">
      {/* Audio de fondo en loop; el atributo muted se controla con el estado */}
      <audio ref={audioRef} src="/sonido.mp3" autoPlay loop muted={isMuted} />

      {/* Botón de toggle para el sonido, posicionado en la esquina superior derecha */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 text-white p-2 bg-black bg-opacity-50 rounded-full focus:outline-none"
      >
        {isMuted ? (
          // Ícono de bocina tachado (mute) mejorado
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5L6 9H3v6h3l5 4V5z" />
            <line x1="19" y1="9" x2="23" y2="13" />
            <line x1="23" y1="9" x2="19" y2="13" />
          </svg>
        ) : (
          // Ícono de bocina (sonido encendido)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5l-5 5H3v4h3l5 4V5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19.07 4.93a10 10 0 010 14.14"
            />
          </svg>
        )}
      </button>

      {/* Renderizado de contenido según la etapa */}
      {stage === 0 && (
        <>
          {!hasFlipped ? (
            <motion.img
              src="/CartaCerrada.png"
              alt="Carta Cerrada"
              className="cursor-pointer"
              initial={{ rotateY: 0 }}
              animate={isAnimating ? { rotateY: 90 } : { rotateY: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => setIsAnimating(true)}
              onAnimationComplete={() => {
                if (isAnimating && !hasFlipped) {
                  setHasFlipped(true);
                }
              }}
            />
          ) : (
            // Una vez realizado el flip, se muestra CartaAbierta.png y se espera el clic para iniciar la transición
            <img
              src="/CartaAbierta.png"
              alt="Carta Abierta"
              className="cursor-pointer"
              onClick={() => setStage(1)}
            />
          )}
        </>
      )}

      {stage === 1 && (
        // Transición combinada: se desliza, escala y desvanece la imagen de CartaAbierta.png
        <motion.img
          src="/CartaAbierta.png"
          alt="Transición combinada"
          className="cursor-pointer"
          initial={{ opacity: 1, scale: 1, y: 0 }}
          animate={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ duration: 1 }}
          onAnimationComplete={() => setStage(2)}
        />
      )}

      {stage === 2 && (
        <div className="relative w-[1200px] h-[900px] flex items-center justify-center">
          {/* Imagen de la carta */}
          <img
            src="/Carta.png"
            alt="Carta Final"
            className="w-full h-full object-contain"
          />

          {/* Contenedor del contenido dentro de la carta */}
          <div
            onClick={handleContentClick}
            className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center px-8 py-6 text-center"
          >
            {/* Texto ajustado */}
            <p
              style={{ fontFamily: "'Dancing Script', cursive" }}
              className="text-lg font-semibold text-red-800 max-w-[40%] pt-3"
            >
              {pages[pageIndex].text}
            </p>

            {/* Imagen dentro de la carta (ajustada) */}
            {pages[pageIndex].image && (
              <img
                src={pages[pageIndex].image}
                alt="Imagen de la tarjeta"
                className="max-w-[80%] max-h-[40%] object-contain my-4 pb-5"
              />
            )}

            {/* Video responsivo */}
            {pages[pageIndex].youtube && (
              <div className="w-full max-w-[50%] pb-50 aspect-video">
                <iframe
                  src={convertToEmbedUrl(pages[pageIndex].youtube)}
                  title="YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            )}

            {/* Texto de "Haz clic para continuar" */}
            {!pages[pageIndex].youtube && (
              <p className="text-sm text-gray-600 mt-4 pb-20">
                Haz clic para continuar
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const convertToEmbedUrl = (url: any) => {
  const videoIdMatch = url.match(
    /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (videoIdMatch && videoIdMatch[1]) {
    return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
  }
  return url;
};
