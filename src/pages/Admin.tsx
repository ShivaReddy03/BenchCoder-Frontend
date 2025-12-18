import { useState } from 'react';
import { problemService } from '@/services/problemService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, FileText } from 'lucide-react';

export default function Admin() {
  const [problemData, setProblemData] = useState({
    title: '',
    description: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    points: 10,
  });
  const [testCaseData, setTestCaseData] = useState({
    problemId: '',
    input: '',
    expected_output: '',
    is_public: true,
  });
  const [loading, setLoading] = useState(false);

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const problem = await problemService.createProblem(problemData);
      toast({
        title: 'Problem created!',
        description: `${problem.title} has been created successfully`,
      });
      setProblemData({
        title: '',
        description: '',
        difficulty: 'easy',
        points: 10,
      });
    } catch (error: any) {
      toast({
        title: 'Failed to create problem',
        description: error.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestCase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!testCaseData.problemId) {
      toast({
        title: 'Invalid problem ID',
        description: 'Please enter a valid problem ID',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await problemService.addTestCase(parseInt(testCaseData.problemId), {
        problem: parseInt(testCaseData.problemId),
        input: testCaseData.input,
        expected_output: testCaseData.expected_output,
        is_public: testCaseData.is_public,
      });
      toast({
        title: 'Test case added!',
        description: 'Test case has been added successfully',
      });
      setTestCaseData({
        problemId: '',
        input: '',
        expected_output: '',
        is_public: true,
      });
    } catch (error: any) {
      toast({
        title: 'Failed to add test case',
        description: error.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage problems and test cases
        </p>
      </div>

      <Tabs defaultValue="problem" className="w-full max-w-2xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="problem">Create Problem</TabsTrigger>
          <TabsTrigger value="testcase">Add Test Case</TabsTrigger>
        </TabsList>

        <TabsContent value="problem" className="mt-6">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                <CardTitle>New Problem</CardTitle>
              </div>
              <CardDescription>
                Add a new coding problem to the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProblem} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Two Sum"
                    value={problemData.title}
                    onChange={(e) => setProblemData({ ...problemData, title: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the problem..."
                    className="min-h-[120px] resize-none"
                    value={problemData.description}
                    onChange={(e) => setProblemData({ ...problemData, description: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={problemData.difficulty}
                      onValueChange={(value: 'easy' | 'medium' | 'hard') =>
                        setProblemData({ ...problemData, difficulty: value })
                      }
                      disabled={loading}
                    >
                      <SelectTrigger id="difficulty">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      min="1"
                      value={problemData.points}
                      onChange={(e) => setProblemData({ ...problemData, points: parseInt(e.target.value) })}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {loading ? 'Creating...' : 'Create Problem'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testcase" className="mt-6">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <CardTitle>New Test Case</CardTitle>
              </div>
              <CardDescription>
                Add a test case to an existing problem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTestCase} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="problemId">Problem ID</Label>
                  <Input
                    id="problemId"
                    type="number"
                    placeholder="Enter problem ID"
                    value={testCaseData.problemId}
                    onChange={(e) => setTestCaseData({ ...testCaseData, problemId: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="input">Input</Label>
                  <Textarea
                    id="input"
                    placeholder="Test case input..."
                    className="resize-none"
                    value={testCaseData.input}
                    onChange={(e) => setTestCaseData({ ...testCaseData, input: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expected_output">Expected Output</Label>
                  <Textarea
                    id="expected_output"
                    placeholder="Expected output..."
                    className="resize-none"
                    value={testCaseData.expected_output}
                    onChange={(e) => setTestCaseData({ ...testCaseData, expected_output: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select
                    value={testCaseData.is_public.toString()}
                    onValueChange={(value) =>
                      setTestCaseData({ ...testCaseData, is_public: value === 'true' })
                    }
                    disabled={loading}
                  >
                    <SelectTrigger id="visibility">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Public</SelectItem>
                      <SelectItem value="false">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {loading ? 'Adding...' : 'Add Test Case'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
