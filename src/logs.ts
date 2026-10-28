export type Invocation={programId:string,depth:number,status:"success"|"failed"|"unknown",units?:number};
const invoke=/^Program (\S+) invoke \[(\d+)\]$/;
const success=/^Program (\S+) success$/;
const failed=/^Program (\S+) failed:/;
const consumed=/^Program (\S+) consumed (\d+) of \d+ compute units$/;

export function parseInvocations(logs:string[]):Invocation[]{
 const stack:Invocation[]=[];const out:Invocation[]=[];
 for(const line of logs){
  let m=line.match(invoke);if(m){const x:Invocation={programId:m[1],depth:Number(m[2]),status:"unknown"};stack.push(x);out.push(x);continue;}
  m=line.match(consumed);if(m){const x=[...stack].reverse().find(v=>v.programId===m![1]&&v.status==="unknown");if(x)x.units=Number(m[2]);continue;}
  m=line.match(success);if(m){const x=[...stack].reverse().find(v=>v.programId===m![1]&&v.status==="unknown");if(x)x.status="success";continue;}
  m=line.match(failed);if(m){const x=[...stack].reverse().find(v=>v.programId===m![1]&&v.status==="unknown");if(x)x.status="failed";}
 }
 return out;
}
