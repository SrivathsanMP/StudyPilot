import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  GraduationCap, 
  Languages, 
  Sparkles, 
  Infinity,
  BookMarked,
  PenTool,
  Library,
  Lightbulb,
  FlaskConical,
  Calculator,
  Globe,
  Atom,
  ArrowRight
} from 'lucide-react';

const GRADES = [
  { id: 1, label: 'Grade 1', icon: BookMarked, subjects: ['Reading', 'Math', 'Art'] },
  { id: 2, label: 'Grade 2', icon: PenTool, subjects: ['Language', 'Math', 'Science'] },
  { id: 3, label: 'Grade 3', icon: Library, subjects: ['English', 'Math', 'EVS'] },
  { id: 4, label: 'Grade 4', icon: Lightbulb, subjects: ['English', 'Math', 'Social'] },
  { id: 5, label: 'Grade 5', icon: BookOpen, subjects: ['English', 'Math', 'Science'] },
  { id: 6, label: 'Grade 6', icon: Globe, subjects: ['English', 'Math', 'History'] },
  { id: 7, label: 'Grade 7', icon: FlaskConical, subjects: ['Math', 'Science', 'Geography'] },
  { id: 8, label: 'Grade 8', icon: Calculator, subjects: ['Algebra', 'Physics', 'Chemistry'] },
  { id: 9, label: 'Grade 9', icon: Atom, subjects: ['Math', 'Biology', 'History'] },
  { id: 10, label: 'Grade 10', icon: GraduationCap, subjects: ['Math', 'Science', 'Social'] },
  { id: 11, label: 'Grade 11', icon: FlaskConical, subjects: ['Physics', 'Chemistry', 'Math'] },
  { id: 12, label: 'Grade 12', icon: GraduationCap, subjects: ['Advanced Math', 'Physics', 'Chemistry'] },
];

const gradeColors: Record<number, string> = {
  1: 'from-grade-1 to-grade-2',
  2: 'from-grade-2 to-grade-3',
  3: 'from-grade-3 to-grade-4',
  4: 'from-grade-4 to-grade-5',
  5: 'from-grade-5 to-grade-6',
  6: 'from-grade-6 to-grade-7',
  7: 'from-grade-7 to-grade-8',
  8: 'from-grade-8 to-grade-9',
  9: 'from-grade-9 to-grade-10',
  10: 'from-grade-10 to-grade-11',
  11: 'from-grade-11 to-grade-12',
  12: 'from-grade-12 to-grade-1',
};

const gradeIconColors: Record<number, string> = {
  1: 'text-grade-1',
  2: 'text-grade-2',
  3: 'text-grade-3',
  4: 'text-grade-4',
  5: 'text-grade-5',
  6: 'text-grade-6',
  7: 'text-grade-7',
  8: 'text-grade-8',
  9: 'text-grade-9',
  10: 'text-grade-10',
  11: 'text-grade-11',
  12: 'text-grade-12',
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGradeClick = (gradeId: number) => {
    navigate(`/grade/${gradeId}`);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-10 animate-fade-in">
        <div className="flex items-center gap-2 text-primary mb-3">
          <div className="w-1.5 h-6 bg-primary rounded-full"></div>
          <span className="text-sm font-semibold uppercase tracking-wider">Teacher Dashboard</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-3">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Select a grade to begin lesson creation and planning. Access AI-powered tools for question papers, explanations, and more.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-5 border border-primary/20 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">12</div>
          <div className="text-sm text-muted-foreground font-medium">Total Grades</div>
        </div>
        <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl p-5 border border-secondary/20 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Languages className="w-5 h-5 text-secondary" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">7</div>
          <div className="text-sm text-muted-foreground font-medium">Languages</div>
        </div>
        <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl p-5 border border-accent/20 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">AI</div>
          <div className="text-sm text-muted-foreground font-medium">Powered Tools</div>
        </div>
        <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-xl p-5 border border-success/20 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Infinity className="w-5 h-5 text-success" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">∞</div>
          <div className="text-sm text-muted-foreground font-medium">Possibilities</div>
        </div>
      </div>

      {/* Grade Cards Grid */}
      <div className="mb-6">
        <h2 className="text-xl font-display font-bold text-foreground mb-1 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Select a Grade
        </h2>
        <p className="text-sm text-muted-foreground">Choose a grade to access teaching tools and resources</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
        {GRADES.map((grade, index) => {
          const IconComponent = grade.icon;
          return (
            <button
              key={grade.id}
              onClick={() => handleGradeClick(grade.id)}
              className="group relative bg-card rounded-2xl p-5 border border-border shadow-soft card-hover text-left overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${gradeColors[grade.id]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              ></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradeColors[grade.id]} bg-opacity-10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-display font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                  {grade.label}
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </h3>
                <div className="mt-2 flex flex-wrap gap-1">
                  {grade.subjects.slice(0, 2).map((subject) => (
                    <span 
                      key={subject}
                      className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {/* Decorative corner */}
              <div 
                className={`absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br ${gradeColors[grade.id]} opacity-15 rounded-full blur-xl group-hover:opacity-30 transition-opacity duration-300`}
              ></div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
