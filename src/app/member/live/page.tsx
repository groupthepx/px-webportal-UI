import SystemMemberShell from "@/content/SystemMemberShell";
import VJOnlyRoute from '@/components/VJOnlyRoute';

export default function MemberLiveShellPage() {
  return <VJOnlyRoute><SystemMemberShell view="live" /></VJOnlyRoute>;
}
