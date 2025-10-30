import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { problemService, Problem, ProblemListResponse } from '@/services/problemService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Loader2, Code2, Trophy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Problems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    loadProblems();
  }, [currentPage, searchTerm, selectedDifficulty]);

  const loadProblems = async () => {
    try {
      setLoading(true);
      const data: ProblemListResponse = await problemService.listProblems(currentPage, 6, searchTerm, selectedDifficulty === 'all' ? undefined : selectedDifficulty);
      setProblems(data.results);
      setCurrentPage(data.current_page);
      setTotalPages(data.total_pages);
      setTotalCount(data.total_count);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDifficultyChange = (value: string) => {
    setSelectedDifficulty(value);
    setCurrentPage(1);
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const pageNumbers = generatePageNumbers();

  const isFiltered = searchTerm || selectedDifficulty !== 'all';

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Coding Problems</h1>
        <p className="text-muted-foreground">
          Choose a problem and start coding. Test your skills and improve with each challenge.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="max-w-md flex-1">
          <Input
            placeholder="Search problems by title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-auto">
          <Select value={selectedDifficulty} onValueChange={handleDifficultyChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {problems.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Code2 className="w-12 h-12 text-muted-foreground mb-4" />
            {isFiltered ? (
              <p className="text-muted-foreground text-center">
                No problems found {searchTerm ? `for "${searchTerm}"` : ''} {selectedDifficulty !== 'all' ? `with difficulty "${selectedDifficulty}"` : ''}.
              </p>
            ) : (
              <p className="text-muted-foreground text-center">
                No problems available yet. Check back soon!
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
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

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                    />
                  </PaginationItem>
                  {pageNumbers.map((pageNum, index) => (
                    <PaginationItem key={index}>
                      {typeof pageNum === 'number' ? (
                        <PaginationLink
                          href="#"
                          isActive={currentPage === pageNum}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNum as number);
                          }}
                        >
                          {pageNum}
                        </PaginationLink>
                      ) : (
                        <PaginationEllipsis />
                      )}
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}