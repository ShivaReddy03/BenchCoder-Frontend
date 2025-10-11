import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { problemService, Problem } from '@/services/problemService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Code2, Trophy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Problems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      const data = await problemService.listProblems();
      setProblems(data);
    } catch (error) {
      toast({
        title: 'Failed to load problems',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-difficulty-easy text-success-foreground';
      case 'medium':
        return 'bg-difficulty-medium text-warning-foreground';
      case 'hard':
        return 'bg-difficulty-hard text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Coding Problems</h1>
        <p className="text-muted-foreground">
          Choose a problem and start coding. Test your skills and improve with each challenge.
        </p>
      </div>

      {problems.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Code2 className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No problems available yet. Check back soon!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="group"
            >
              <Card className="h-full shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 border-border hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {problem.title}
                    </CardTitle>
                    <Badge className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {problem.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span>{problem.points} points</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
