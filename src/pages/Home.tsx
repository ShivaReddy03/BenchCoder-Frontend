import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2, Trophy, Zap, Users, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Scene3D } from '@/components/3d/Scene3D';
import { Suspense } from 'react';

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
    <div className="animate-fade-in film-grain min-h-screen">
      {/* 3D Background */}
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 min-h-screen flex items-center">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Floating Badge */}
            <div className="inline-flex items-center gap-2 glass-morphic px-6 py-3 rounded-full mb-8 animate-float">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Step Into The Digital Universe</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-slide-up leading-tight">
              Master Your{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Coding DNA
                </span>
                <div className="absolute inset-0 blur-2xl bg-gradient-primary opacity-20 -z-10" />
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/80 mb-12 animate-slide-up max-w-3xl mx-auto font-light">
              Dive into an immersive world where code comes alive. Practice algorithms, 
              solve challenges, and evolve into a world-class developer.
            </p>

            {/* CTA Buttons - Floating Glass Cards */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up">
              {isAuthenticated ? (
                <Link to="/problems" className="w-full sm:w-auto">
                  <div className="glass-morphic p-1 rounded-xl hover:shadow-glow transition-all duration-300 group">
                    <Button 
                      size="lg" 
                      className="w-full gradient-primary shadow-glow text-lg px-10 py-7 text-foreground font-semibold hover:scale-105 transition-transform"
                    >
                      Browse Problems
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Link>
              ) : (
                <>
                  <Link to="/register" className="w-full sm:w-auto">
                    <div className="glass-morphic p-1 rounded-xl hover:shadow-glow transition-all duration-300 group animate-float">
                      <Button 
                        size="lg" 
                        className="w-full gradient-primary shadow-glow text-lg px-10 py-7 text-foreground font-semibold hover:scale-105 transition-transform"
                      >
                        Start Coding Now
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto">
                    <div className="glass-morphic p-1 rounded-xl hover:shadow-glow-secondary transition-all duration-300 group animate-float-delayed">
                      <Button 
                        size="lg" 
                        variant="ghost"
                        className="w-full text-lg px-10 py-7 font-semibold hover:scale-105 transition-transform text-foreground"
                      >
                        Sign In
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </Link>
                </>
              )}
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-6 mt-20 max-w-3xl mx-auto">
              {[
                { label: 'Active Coders', value: '10K+' },
                { label: 'Problems Solved', value: '500K+' },
                { label: 'Success Rate', value: '94%' },
              ].map((stat, i) => (
                <div 
                  key={i} 
                  className="glass-morphic p-6 rounded-xl text-center hover:scale-105 transition-transform"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block glass-morphic px-6 py-2 rounded-full mb-6">
              <span className="text-sm font-medium text-primary">Platform Features</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Why{' '}
              <span className="bg-gradient-secondary bg-clip-text text-transparent">
                BenchCoder
              </span>
              ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to excel in coding interviews and competitions, 
              powered by cutting-edge technology
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="glass-morphic p-8 rounded-2xl hover:shadow-glow transition-all duration-500 hover:scale-105 hover:-translate-y-2 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-background" />
                    </div>
                    <div className="absolute inset-0 blur-xl bg-gradient-primary opacity-20 group-hover:opacity-40 transition-opacity" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4">
          <div className="glass-morphic p-12 md:p-16 rounded-3xl max-w-4xl mx-auto text-center relative overflow-hidden group">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-primary opacity-5 group-hover:opacity-10 transition-opacity blur-3xl" />
            
            <div className="relative z-10">
              <div className="inline-block glass-morphic px-6 py-2 rounded-full mb-6">
                <span className="text-sm font-medium text-primary">Join The Community</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Ready to{' '}
                <span className="bg-gradient-secondary bg-clip-text text-transparent">
                  Transform
                </span>{' '}
                Your Skills?
              </h2>
              
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join thousands of developers who are already mastering their craft 
                in our immersive coding universe
              </p>
              
              {!isAuthenticated && (
                <Link to="/register">
                  <div className="inline-block glass-morphic p-1 rounded-xl hover:shadow-glow-secondary transition-all duration-300 group">
                    <Button 
                      size="lg" 
                      className="gradient-secondary shadow-glow-secondary text-lg px-12 py-7 text-foreground font-semibold hover:scale-105 transition-transform"
                    >
                      Create Free Account
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Link>
              )}
              
              <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <span>No Credit Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '1s' }} />
                  <span>Instant Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
