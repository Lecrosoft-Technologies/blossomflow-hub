import { Play, Clock, Users, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import blastImage from "@/assets/blossom-group1.jpg";
import yogaImage from "@/assets/blossom-group2.jpg";
import strengthImage from "@/assets/blossom-group3.jpg";
import danceImage from "@/assets/blossom-group4.jpg";
import pilatesImage from "@/assets/blossom-group5.jpg";
import boxingImage from "@/assets/blossom-group8.jpg";
import blossomSingleImage from "@/assets/blossom-single.jpg";
import blossomSingle2Image from "@/assets/blossom-single2.jpg";
import dance from "@/assets/dance-no-logo.jpg";

const VirtualClasses = () => {
  const classes = [
    {
      id: 1,
      title: "HIIT Blast Revolution",
      instructor: "Maya Rodriguez",
      duration: 45,
      participants: 234,
      rating: 4.9,
      difficulty: "Advanced",
      type: "Live",
      schedule: "Today 6:00 PM",
      thumbnail: blastImage,
      price: { free: false, amount: 15 },
      category: "HIIT",
    },
    {
      id: 2,
      title: "Zen Flow Yoga",
      instructor: "Sarah Chen",
      duration: 60,
      participants: 156,
      rating: 4.8,
      difficulty: "Beginner",
      type: "Recorded",
      schedule: "Available Now",
      thumbnail: blossomSingle2Image,
      // thumbnail:
      //   "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=500&h=300&fit=crop",
      price: { free: true, amount: 0 },
      category: "Yoga",
    },
    {
      id: 3,
      title: "Beast Mode Strength",
      instructor: "Marcus Johnson",
      duration: 50,
      participants: 89,
      rating: 4.7,
      difficulty: "Intermediate",
      type: "Live",
      schedule: "Tomorrow 7:30 AM",
      thumbnail:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
      price: { free: false, amount: 20 },
      category: "Strength",
    },
    {
      id: 4,
      title: "Cardio Dance Fusion",
      instructor: "Lisa Thompson",
      duration: 40,
      participants: 312,
      rating: 4.9,
      difficulty: "All Levels",
      type: "Recorded",
      schedule: "Available Now",
      thumbnail: dance,
      // thumbnail:
      //   "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=500&h=300&fit=crop",
      price: { free: true, amount: 0 },
      category: "Cardio",
    },
    {
      id: 5,
      title: "Pilates Core Power",
      instructor: "Emma Davis",
      duration: 35,
      participants: 178,
      rating: 4.6,
      difficulty: "Intermediate",
      type: "Live",
      schedule: "Wed 5:30 PM",
      thumbnail: blossomSingleImage,
      price: { free: false, amount: 12 },
      category: "Pilates",
    },
    {
      id: 6,
      title: "Boxing Bootcamp",
      instructor: "Jake Martinez",
      duration: 55,
      participants: 267,
      rating: 4.8,
      difficulty: "Advanced",
      type: "Recorded",
      schedule: "Available Now",
      thumbnail:
        "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=500&h=300&fit=crop",
      price: { free: false, amount: 18 },
      category: "Boxing",
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      Beginner: "bg-energy-green",
      Intermediate: "bg-cyber-blue",
      Advanced: "bg-gradient-secondary",
      "All Levels": "bg-gradient-primary",
    };
    return colors[difficulty] || "bg-muted";
  };

  return (
    <section id="classes" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              Virtual
            </span>
            <br />
            Fitness Classes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Access world-class fitness instruction from anywhere. Join live
            sessions or train on-demand with our expert trainers.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {["All", "Live", "Recorded", "Free"].map((filter) => (
              <Button
                key={filter}
                variant="outline"
                size="sm"
                className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((classItem) => (
            <div
              key={classItem.id}
              className="card-glass group cursor-pointer relative overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img
                  src={classItem.thumbnail}
                  alt={classItem.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-primary/90 rounded-full p-4 backdrop-blur-sm">
                    <Play className="h-8 w-8 text-white fill-current" />
                  </div>
                </div>

                {/* Live Badge */}
                {classItem.type === "Live" && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white animate-pulse">
                    🔴 LIVE
                  </Badge>
                )}

                {/* Free Badge */}
                {classItem.price.free && (
                  <Badge className="absolute top-4 right-4 bg-energy-green text-white">
                    FREE
                  </Badge>
                )}

                {/* Duration */}
                <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1">
                  <div className="flex items-center space-x-1 text-sm">
                    <Clock className="h-3 w-3" />
                    <span>{classItem.duration}min</span>
                  </div>
                </div>
              </div>

              {/* Class Info */}
              <div className="space-y-3">
                {/* Category & Difficulty */}
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-xs">
                    {classItem.category}
                  </Badge>
                  <Badge
                    className={`text-xs text-white ${getDifficultyColor(
                      classItem.difficulty
                    )}`}
                  >
                    {classItem.difficulty}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                  {classItem.title}
                </h3>

                {/* Instructor */}
                <p className="text-muted-foreground">
                  with{" "}
                  <span className="text-primary font-medium">
                    {classItem.instructor}
                  </span>
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{classItem.participants}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span>{classItem.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span className="text-xs">{classItem.schedule}</span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-lg font-bold">
                    {classItem.price.free ? (
                      <span className="text-energy-green">FREE</span>
                    ) : (
                      <span className="text-primary">
                        ${classItem.price.amount}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="btn-secondary group-hover:btn-primary transition-all duration-300"
                  >
                    {classItem.type === "Live" ? "Join Live" : "Watch Now"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="card-glass max-w-2xl mx-auto p-8">
            <h3 className="text-2xl font-bold mb-4">
              Ready to start your fitness journey?
            </h3>
            <p className="text-muted-foreground mb-6">
              Get unlimited access to all classes with our premium membership
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-primary">Start Free Trial</Button>
              <Button
                variant="outline"
                className="hover:bg-primary hover:text-primary-foreground"
              >
                View All Classes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualClasses;
