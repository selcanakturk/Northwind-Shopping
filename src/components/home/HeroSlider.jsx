import React, { Component } from "react";
import { Link } from "react-router-dom";

class HeroSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0,
    };
    this.slides = [
      {
        title: "Modern Living",
        subtitle: "Discover furniture that transforms your space",
        image: "https://picsum.photos/seed/hero1/1600/600",
        link: "/",
        linkText: "Shop Now",
      },
      {
        title: "Design Excellence",
        subtitle: "Curated pieces for every room",
        image: "https://picsum.photos/seed/hero2/1600/600",
        link: "/",
        linkText: "Explore",
      },
      {
        title: "Quality Craftsmanship",
        subtitle: "Furniture built to last",
        image: "https://picsum.photos/seed/hero3/1600/600",
        link: "/",
        linkText: "Shop Collection",
      },
    ];
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  nextSlide = () => {
    this.setState((prevState) => ({
      currentSlide: (prevState.currentSlide + 1) % this.slides.length,
    }));
  };

  prevSlide = () => {
    this.setState((prevState) => ({
      currentSlide:
        prevState.currentSlide === 0
          ? this.slides.length - 1
          : prevState.currentSlide - 1,
    }));
  };

  goToSlide = (index) => {
    this.setState({ currentSlide: index });
  };

  render() {
    const { currentSlide } = this.state;
    const currentSlideData = this.slides[currentSlide];

    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(400px, 50vw, 600px)",
          overflow: "hidden",
          marginBottom: "4rem",
          marginLeft: "-1rem",
          marginRight: "-1rem",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <img
            src={currentSlideData.image}
            alt={currentSlideData.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "4rem",
              left: "4rem",
              right: "4rem",
              maxWidth: "500px",
              color: "#ffffff",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: "300",
                letterSpacing: "2px",
                marginBottom: "1rem",
                lineHeight: "1.2",
              }}
            >
              {currentSlideData.title}
            </h1>
            <p
              style={{
                fontSize: "clamp(1rem, 2vw, 1.125rem)",
                fontWeight: "300",
                marginBottom: "2rem",
                lineHeight: "1.6",
              }}
            >
              {currentSlideData.subtitle}
            </p>
            <Link
              to={currentSlideData.link}
              style={{
                display: "inline-block",
                padding: "1rem 2.5rem",
                backgroundColor: "#1a1a1a",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#000000")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#1a1a1a")}
            >
              {currentSlideData.linkText}
            </Link>
          </div>
        </div>

        <button
          onClick={this.prevSlide}
          style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255, 255, 255, 0.9)",
            border: "none",
            width: "48px",
            height: "48px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#ffffff")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.9)")}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          onClick={this.nextSlide}
          style={{
            position: "absolute",
            right: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255, 255, 255, 0.9)",
            border: "none",
            width: "48px",
            height: "48px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#ffffff")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.9)")}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <div
          style={{
            position: "absolute",
            bottom: "1.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.5rem",
          }}
        >
          {this.slides.map((_, index) => (
            <button
              key={index}
              onClick={() => this.goToSlide(index)}
              style={{
                width: index === currentSlide ? "24px" : "8px",
                height: "8px",
                background: index === currentSlide ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                borderRadius: "4px",
              }}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default HeroSlider;

