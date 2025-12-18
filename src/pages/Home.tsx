import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
      <section className="py-24 md:py-32">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">
              Master Your Coding Skills
            </h1>
            
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Practice algorithms, solve challenges, and become a better developer with our curated problem sets.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/problems">
                  <Button size="lg" className="px-8">
                    Browse Problems
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="px-8">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="px-8">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-12 mt-16 pt-8 border-t border-border">
              {[
                { label: 'Active Users', value: '10K+' },
                { label: 'Problems', value: '500+' },
                { label: 'Success Rate', value: '94%' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Why BenchCoder?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Everything you need to excel in coding interviews and competitions.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 border-t border-border">
          <div className="container mx-auto">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                Ready to Start?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of developers improving their skills every day.
              </p>
              <Link to="/register">
                <Button size="lg" className="px-8">
                  Create Free Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-4">
                Free forever · No credit card required
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
