import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotes, Note } from '@/contexts/NotesContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  X, 
  Sparkles, 
  BookOpen, 
  FileQuestion, 
  Languages,
  Loader2,
  Save,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

const GRADE_INFO: Record<number, { label: string; color: string }> = {
  1: { label: 'Grade 1', color: 'grade-1' },
  2: { label: 'Grade 2', color: 'grade-2' },
  3: { label: 'Grade 3', color: 'grade-3' },
  4: { label: 'Grade 4', color: 'grade-4' },
  5: { label: 'Grade 5', color: 'grade-5' },
  6: { label: 'Grade 6', color: 'grade-6' },
  7: { label: 'Grade 7', color: 'grade-7' },
  8: { label: 'Grade 8', color: 'grade-8' },
  9: { label: 'Grade 9', color: 'grade-9' },
  10: { label: 'Grade 10', color: 'grade-10' },
  11: { label: 'Grade 11', color: 'grade-11' },
  12: { label: 'Grade 12', color: 'grade-12' },
};

const MOCK_LESSON_PLAN = `# Lesson Plan: Introduction to Fractions

## Learning Objectives
By the end of this lesson, students will be able to:
- Understand what a fraction represents
- Identify numerator and denominator
- Compare simple fractions visually

## Materials Needed
- Fraction circles or strips
- Whiteboard and markers
- Practice worksheets

## Lesson Structure (45 minutes)

### Introduction (10 min)
Start with a real-world example: sharing a pizza equally among friends.

### Direct Instruction (15 min)
1. Introduce fraction vocabulary
2. Demonstrate with visual aids
3. Show equivalent fractions

### Guided Practice (15 min)
Students work in pairs to identify fractions using manipulatives.

### Closure (5 min)
Quick quiz: Identify fractions shown on the board.

## Assessment
Exit ticket with 3 fraction identification questions.`;

const MOCK_QUESTION_PAPER = `# Question Paper: Mathematics
**Grade Level:** Appropriate for selected grade
**Duration:** 45 minutes
**Total Marks:** 50

---

## Section A: Multiple Choice (10 marks)

1. What is 1/2 + 1/2? (2 marks)
   a) 1/4  b) 1  c) 2  d) 1/2

2. Which fraction is larger? (2 marks)
   a) 1/4  b) 1/2  c) 1/3  d) 1/5

3. Convert 0.5 to a fraction: (2 marks)
   a) 1/5  b) 1/2  c) 5/10  d) Both b and c

## Section B: Short Answer (20 marks)

4. Simplify 4/8 to its lowest terms. (4 marks)

5. Draw a circle and shade 3/4 of it. (4 marks)

6. Add: 1/4 + 2/4 = ? (4 marks)

## Section C: Word Problems (20 marks)

7. Maria has 8 apples. She gives 1/4 of them to her friend. How many apples did she give away? (10 marks)

8. A pizza is cut into 6 equal slices. If you eat 2 slices, what fraction of the pizza did you eat? (10 marks)`;

const MOCK_EXPLANATION = `# Topic Explanation: Understanding Fractions

## What is a Fraction?
A fraction represents a part of a whole. When we divide something into equal parts, each part is a fraction of the whole.

## Parts of a Fraction
- **Numerator** (top number): Shows how many parts we have
- **Denominator** (bottom number): Shows total equal parts

## Visual Example
Imagine a chocolate bar divided into 4 equal pieces:
- If you take 1 piece, you have 1/4 (one-fourth)
- If you take 2 pieces, you have 2/4 (two-fourths) = 1/2

## Real-Life Examples
1. Pizza slices
2. Cake portions
3. Hours in a day (1 hour = 1/24 of a day)
4. Coins (25 cents = 1/4 of a dollar)

## Key Points to Remember
- Equal parts are essential
- The denominator tells us how many parts make a whole
- The numerator tells us how many parts we're talking about

## Practice Activity
Look around your classroom. Can you find examples of fractions in everyday objects?`;

const GradeWorkspace = () => {
  const { gradeId } = useParams<{ gradeId: string }>();
  const navigate = useNavigate();
  const { getLanguageLabel } = useLanguage();
  const { addNote, getNotesByGrade, deleteNote } = useNotes();
  
  const gradeNum = parseInt(gradeId || '1');
  const gradeInfo = GRADE_INFO[gradeNum] || GRADE_INFO[1];
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [topicInput, setTopicInput] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [contentType, setContentType] = useState<'lesson-plan' | 'question-paper' | 'explanation' | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const gradeNotes = getNotesByGrade(gradeNum);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          toast.success('PDF uploaded successfully!');
        }
      }, 100);
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateContent = async (type: 'lesson-plan' | 'question-paper' | 'explanation') => {
    if (!topicInput.trim() && !uploadedFile) {
      toast.error('Please enter a topic or upload a PDF first');
      return;
    }

    setIsGenerating(true);
    setContentType(type);
    
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    let content = '';
    switch (type) {
      case 'lesson-plan':
        content = MOCK_LESSON_PLAN;
        break;
      case 'question-paper':
        content = MOCK_QUESTION_PAPER;
        break;
      case 'explanation':
        content = MOCK_EXPLANATION;
        break;
    }
    
    setGeneratedContent(content);
    setIsGenerating(false);
    toast.success(`${type.replace('-', ' ')} generated successfully!`);
  };

  const saveAsNote = () => {
    if (!generatedContent || !contentType) return;
    
    addNote({
      gradeId: gradeNum,
      topic: topicInput || uploadedFile?.name || 'Untitled',
      content: generatedContent,
      type: contentType,
    });
    
    toast.success('Note saved successfully!');
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const typeLabels: Record<string, string> = {
    'lesson-plan': 'Lesson Plan',
    'question-paper': 'Question Paper',
    'explanation': 'Explanation',
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 animate-fade-in">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="rounded-full hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
            {gradeInfo.label} Workspace
          </h1>
          <p className="text-muted-foreground mt-1">
            Create content in {getLanguageLabel()}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* PDF Upload */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h2 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload PDF / Topic
            </h2>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {!uploadedFile ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-xl p-8 hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    <FileText className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-foreground font-medium mb-1">Drop your PDF here</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                </div>
              </button>
            ) : (
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground truncate max-w-[200px]">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={removeFile}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-3 text-sm text-muted-foreground">or enter a topic</span>
              </div>
            </div>

            <Textarea
              placeholder="Enter a topic, e.g., 'Introduction to Fractions' or 'Photosynthesis'"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              className="min-h-[80px] resize-none rounded-xl border-2 focus:border-primary"
            />
          </div>

          {/* AI Actions */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              AI Actions
            </h2>
            
            <div className="grid sm:grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2 border-2 hover:border-primary hover:bg-primary/5"
                onClick={() => generateContent('lesson-plan')}
                disabled={isGenerating}
              >
                {isGenerating && contentType === 'lesson-plan' ? (
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                ) : (
                  <BookOpen className="w-6 h-6 text-primary" />
                )}
                <span className="font-medium">Generate Lesson Plan</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2 border-2 hover:border-secondary hover:bg-secondary/5"
                onClick={() => generateContent('question-paper')}
                disabled={isGenerating}
              >
                {isGenerating && contentType === 'question-paper' ? (
                  <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                ) : (
                  <FileQuestion className="w-6 h-6 text-secondary" />
                )}
                <span className="font-medium">Generate Question Paper</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2 border-2 hover:border-accent hover:bg-accent/5"
                onClick={() => generateContent('explanation')}
                disabled={isGenerating}
              >
                {isGenerating && contentType === 'explanation' ? (
                  <Loader2 className="w-6 h-6 animate-spin text-accent" />
                ) : (
                  <Languages className="w-6 h-6 text-accent" />
                )}
                <span className="font-medium">Explain Topic</span>
              </Button>
            </div>
          </div>

          {/* Generated Content */}
          {generatedContent && (
            <div className="bg-card rounded-2xl border border-border p-6 shadow-soft animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-bold text-foreground">
                  {contentType && typeLabels[contentType]}
                </h2>
                <Button variant="default" size="sm" onClick={saveAsNote}>
                  <Save className="w-4 h-4 mr-2" />
                  Save as Note
                </Button>
              </div>
              <div className="prose prose-sm max-w-none bg-muted/50 rounded-xl p-5 max-h-[400px] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-foreground text-sm leading-relaxed">
                  {generatedContent}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Notes */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center justify-between w-full mb-4"
            >
              <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Saved Notes ({gradeNotes.length})
              </h2>
              {showNotes ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {showNotes && (
              <div className="space-y-3">
                {gradeNotes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No saved notes yet.
                  </p>
                ) : (
                  gradeNotes.map((note) => (
                    <NoteCard key={note.id} note={note} onDelete={deleteNote} />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

const NoteCard = ({ note, onDelete }: NoteCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const typeLabels: Record<string, { label: string; color: string }> = {
    'lesson-plan': { label: 'Lesson Plan', color: 'bg-primary/10 text-primary' },
    'question-paper': { label: 'Question Paper', color: 'bg-secondary/10 text-secondary' },
    'explanation': { label: 'Explanation', color: 'bg-accent/10 text-accent' },
  };

  const typeInfo = typeLabels[note.type] || typeLabels['lesson-plan'];

  return (
    <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
          <h3 className="font-medium text-foreground mt-2 line-clamp-1">{note.topic}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }).format(note.timestamp)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(note.id)}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-primary font-medium mt-2"
      >
        {expanded ? 'Show less' : 'Show more'}
      </button>
      
      {expanded && (
        <div className="mt-3 p-3 bg-card rounded-lg text-xs text-muted-foreground max-h-40 overflow-y-auto">
          <pre className="whitespace-pre-wrap font-sans">{note.content}</pre>
        </div>
      )}
    </div>
  );
};

export default GradeWorkspace;
