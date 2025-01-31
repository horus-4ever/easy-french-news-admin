// src/models/Article.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

interface OldIQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface IQuestion {
  questionText: string;
  options: string[];
  correctAnswer: number;
}

interface OldIVocabulary {
  word: string;
  translation: string;
  category: 'noun' | 'verb1' | 'verb2' | 'verb3' | 'adjective' | 'adverb' | 'expression';
}

interface IVocabulary {
  words: string[];
  category: string[];
  translations: any;
}

interface IGrammarExample {
  french: string;
  japanese: string;
}

interface IGrammarPoint {
  title: string;
  explanation: string;
  examples: IGrammarExample[];
}

interface IArticleVersion {
  content: string;
  audioUrl: string;
  vocabulary: IVocabulary;
  grammarPoints: IGrammarPoint[];
  questions: IQuestion[];
}

interface OldIArticleVersion {
  content: string;
  audioUrl: string;
  vocabulary: OldIVocabulary[];
  grammarPoints: IGrammarPoint[];
  questions: OldIQuestion[];
}

export interface IArticle extends Document {
  _id: string;
  title: string;
  sourceUrl: string;
  imageUrl: string;
  publishDate: Date;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  labels: string[];
  easyVersion: IArticleVersion;
  mediumVersion: IArticleVersion;
}

export interface OldIArticle extends Document {
  title: string;
  sourceUrl: string;
  imageUrl: string;
  publishDate: Date;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  labels: string[];
  easyVersion: OldIArticleVersion;
  mediumVersion: OldIArticleVersion;
}


const QuestionsSchema = new Schema<IQuestion>(
  {
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true }
  },
  { _id: false }
)

// Schema for Vocabulary
const VocabularySchema = new Schema<IVocabulary>(
  {
    words: { type: [String], required: true },
    category: { type: [String], required: true },
    translations: {
      japanese: { type: [String], required: true },
      english: { type: [String], required: false, default: [] },
      // Add more languages here if needed
    },
  },
  { _id: false }
);

// GrammarExample Schema remains unchanged
const GrammarExampleSchema = new Schema<IGrammarExample>(
  {
    french: { type: String, required: true },
    japanese: { type: String, required: true },
  },
  { _id: false }
);

// GrammarPoint Schema remains unchanged
const GrammarPointSchema = new Schema<IGrammarPoint>(
  {
    title: { type: String, required: true },
    explanation: { type: String, required: true },
    examples: { type: [GrammarExampleSchema], required: true },
  },
  { _id: false }
);

const ArticleVersionSchema = new Schema<IArticleVersion>(
  {
    content: { type: String, required: true },
    audioUrl: { type: String, required: true },
    vocabulary: { type: VocabularySchema, required: true },
    grammarPoints: { type: [GrammarPointSchema], required: true },
    questions: { type: [QuestionsSchema], required: true }
  },
  { _id: false }
);


// Article Schema remains largely unchanged, but references the updated ArticleVersionSchema
const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    sourceUrl: { type: String, required: false },
    imageUrl: { type: String, required: false },
    publishDate: { type: Date, required: false },
    published: { type: Boolean, required: true, default: false },
    labels: [{ type: String, required: false }],
    easyVersion: { type: ArticleVersionSchema, required: true },
    mediumVersion: { type: ArticleVersionSchema, required: true },
  },
  {
    timestamps: true,
  }
);

const Article: Model<IArticle> =
  mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema, "articles");

export { Article };
