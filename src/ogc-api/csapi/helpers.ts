import { CSAPIParameter } from './model';

export function extractParameters(parameterBlock: Record<string, any>): CSAPIParameter[] {
  return Object.values(parameterBlock) as CSAPIParameter[];
}
