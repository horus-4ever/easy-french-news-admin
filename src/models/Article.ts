// src/models/Article.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

interface IQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface IVocabulary {
  word: string;
  translation: string;
  category: 'noun' | 'verb1' | 'verb2' | 'verb3' | 'adjective' | 'adverb' | 'expression' | 'preposition' | 'other';
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
  vocabulary: IVocabulary[];
  grammarPoints: IGrammarPoint[];
  questions: IQuestion[];
}

export interface IArticle extends Document {
  title: string;
  sourceUrl?: string;
  imageUrl?: string;
  publishDate?: Date;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  labels?: string[];
  easyVersion: IArticleVersion;
  mediumVersion: IArticleVersion;
}

// ============= SCHEMAS =============

const VocabularySchema = new Schema<IVocabulary>(
  {
    word: { type: String, required: true },
    translation: { type: String, required: true },
    category: { type: String, required: true },
  },
  { _id: false }
);

const GrammarExampleSchema = new Schema<IGrammarExample>(
  {
    french: { type: String, required: true },
    japanese: { type: String, required: true },
  },
  { _id: false }
);

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
    vocabulary: { type: [VocabularySchema], required: true },
    grammarPoints: { type: [GrammarPointSchema], required: true },
    questions: {
      type: [
        {
          id: Number,
          questionText: String,
          options: [String],
          correctAnswer: String,
        },
      ],
      required: true,
    },
  },
  { _id: false }
);

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    sourceUrl: { type: String },
    imageUrl: { type: String },
    publishDate: { type: Date },
    published: { type: Boolean, required: true, default: false },
    labels: [{ type: String }],
    easyVersion: { type: ArticleVersionSchema, required: true },
    mediumVersion: { type: ArticleVersionSchema, required: true },
  },
  {
    timestamps: true, // This will automatically add createdAt and updatedAt
  }
);

// This check prevents "Cannot overwrite model once compiled" error in dev
const Article: Model<IArticle> =
  mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);

export default Article;
