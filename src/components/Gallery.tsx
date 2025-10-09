import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import gymInterior from "@/assets/gym-interior-1.jpg";
import gymClass from "@/assets/gym-class.jpg";
import personalTraining from "@/assets/personal-training.jpg";

import blastImage from "@/assets/blossom-group1.jpg";
import yogaImage from "@/assets/blossom-group2.jpg";
import strengthImage from "@/assets/blossom-group3.jpg";
import danceImage from "@/assets/blossom-group4.jpg";
import pilatesImage from "@/assets/blossom-group5.jpg";
import boxingImage from "@/assets/blossom-group8.jpg";
import blossomSingleImage from "@/assets/blossom-single.jpg";
import blossomSingle2Image from "@/assets/blossom-single2.jpg";
import dance from "@/assets/dance-no-logo.jpg";
import eventPics from "@/assets/blossom-event.jpg";
import matureGroup from "@/assets/mature-grop.jpg";
import blossomSingleWhite from "@/assets/blossom-single-white.jpg";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryImages = [
    {
      id: 1,
      src: eventPics,
      alt: "Modern Gym Interior",
      title: "State-of-the-Art Equipment",
      description:
        "Experience our fully equipped fitness facility with the latest technology",
    },
    {
      id: 2,
      src: matureGroup,
      alt: "Group Fitness Class",
      title: "Group Fitness Classes",
      description:
        "Join our energetic group sessions and train with like-minded individuals",
    },
    {
      id: 3,
      src: blossomSingle2Image,
      alt: "Personal Training Session",
      title: "Personal Training",
      description:
        "One-on-one coaching tailored to your specific fitness goals",
    },
    {
      id: 4,
      src: danceImage,
      alt: "Cardio Area",
      title: "Cardio Zone",
      description:
        "Dedicated cardio area with premium machines and entertainment systems",
    },
    {
      id: 5,
      src: strengthImage,
      alt: "Strength Training",
      title: "Strength Training",
      description: "Complete free weights and resistance training equipment",
    },
    {
      id: 6,
      src: blossomSingleWhite,
      alt: "Wellness Area",
      title: "Wellness & Recovery",
      description: "Dedicated space for stretching, meditation, and recovery",
    },
  ];

  const openModal = (index: number) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1
      );
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Our Gym <span className="text-primary">Environment</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Step into our world-class fitness facility designed to inspire and
            motivate your fitness journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <Card
              key={image.id}
              className="card-glass overflow-hidden group cursor-pointer hover-scale"
              onClick={() => openModal(index)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                  <h3 className="font-bold text-lg mb-1">{image.title}</h3>
                  <p className="text-sm text-white/90">{image.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
                onClick={closeModal}
              >
                <X className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                onClick={prevImage}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                onClick={nextImage}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>

              <img
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                className="max-w-full max-h-full object-contain"
              />

              <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                <h3 className="text-xl font-bold mb-2">
                  {galleryImages[selectedImage].title}
                </h3>
                <p className="text-white/90">
                  {galleryImages[selectedImage].description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
