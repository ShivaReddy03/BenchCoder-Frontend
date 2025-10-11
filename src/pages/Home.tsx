import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2, Trophy, Zap, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Code2,
      title: 'Practice Coding',
      description: 'Solve challenging problems and improve your programming skills',
    },
    {
      icon: Trophy,
      title: 'Earn Points',
      description: 'Complete problems and earn points based on difficulty',
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Get immediate results on your submissions',
    },
    {
      icon: Users,
      title: 'Join Community',
      description: 'Connect with other developers and grow together',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 opacity-50" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
              Master Your{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Coding Skills
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-slide-up">
              Practice algorithms, solve challenges, and become a better developer
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              {isAuthenticated ? (
                <Link to="/problems">
                  <Button size="lg" className="gradient-primary shadow-glow text-lg px-8">
                    Browse Problems
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="gradient-primary shadow-glow text-lg px-8">
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="text-lg px-8">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why BenchCoder?</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to excel in coding interviews and competitions
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 border-border"
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="shadow-card border-border bg-gradient-card max-w-3xl mx-auto">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Coding?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of developers improving their skills daily
              </p>
              {!isAuthenticated && (
                <Link to="/register">
                  <Button size="lg" className="gradient-primary shadow-glow text-lg px-8">
                    Create Free Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
