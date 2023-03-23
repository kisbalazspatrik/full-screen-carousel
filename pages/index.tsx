import React, { useState, useEffect } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import Head from "next/head";

interface CarouselProps {
  currentPage: number;
}

const useScrollHandler = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleScroll = (event: WheelEvent) => {
    if (!isScrolling) {
      setIsScrolling(true);
      const direction = event.deltaY > 0 ? 1 : -1;
      const nextPage = (currentPage + direction + 5) % 5 || 5;
      setCurrentPage(nextPage);
      setTimeout(() => setIsScrolling(false), 1200);
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [isScrolling, currentPage]);

  return { currentPage, isScrolling };
};

const CarouselContainer: React.FC<CarouselProps> = ({ currentPage }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  const updateViewportWidth = () => {
    setViewportWidth(window.innerWidth);
  };

  useEffect(() => {
    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);
    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.style.transform = `translateX(-${
        (currentPage - 1) * viewportWidth
      }px)`;
    }
  }, [currentPage, viewportWidth]);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.style.transition = "transform 1200ms ease-out";
      return () => {
        container.style.transition = "";
      };
    }
  }, []);

  return (
    <Flex
      ref={containerRef}
      width={`${viewportWidth * 5}px`}
      height={"100%"}
      transform={`translateX(-${(currentPage - 1) * viewportWidth}px)`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Flex
          key={i}
          width={`${viewportWidth}px`}
          height={"100%"}
          fontSize={"72px"}
          textAlign={"center"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Text color={"white"}>{i + 1}</Text>
        </Flex>
      ))}
    </Flex>
  );
};

const CarouselPage: React.FC = () => {
  const { currentPage } = useScrollHandler();

  return (
    <>
      <Head>
        <title>Responsive Carousel</title>
        <meta
          name="description"
          content="This project demonstrates a responsive carousel built with React and TypeScript. The carousel automatically adapts to the width of the screen and supports touchpad or mouse wheel navigation."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        overflow={"hidden"}
        width={"100%"}
        height={"100vh"}
        className="dark-bg"
      >
        <CarouselContainer currentPage={currentPage} />
      </Box>
    </>
  );
};

export default CarouselPage;
