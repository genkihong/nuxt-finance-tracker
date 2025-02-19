export type Transaction = {
  id: string;
  type: 'Income' | 'Expense' | 'Investment' | 'Savings';
  amount: number;
  description: string;
  category?: string;
  created_at: string;
};
export interface Period {
  from: Date;
  to: Date;
}

