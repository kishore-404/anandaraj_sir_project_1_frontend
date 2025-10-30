


interface QA {
  q: string;
  a: string;
}

interface Unit {
  _id?: string;
  name: string;
  subjectId?: string;
  createdAt?: string;
  updatedAt?: string;
  title: string;
  description: string;
  unitFileUrl?: string;
  twoMarkFileUrl?: string;
  fiveMarkFileUrl?: string;
  tenMarkFileUrl?: string;
  generatedTwoMark?: QA[];
  generatedFiveMark?: QA[];
  generatedTenMark?: QA[];
  subject?: {
    name: string;
    code: string;
  };
}
