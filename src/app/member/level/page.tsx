import SystemMemberShell from "@/content/SystemMemberShell";
import VJOnlyRoute from '@/components/VJOnlyRoute';

export default function MemberLevelShellPage() {
  return <VJOnlyRoute><SystemMemberShell view="level" /></VJOnlyRoute>;
}
