export const formatTimeAgo = (dateString: string): string => {
   const date = new Date(dateString);
   const now = new Date();
   const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

   if (diffInHours < 1) return 'Hozirgina';
   if (diffInHours < 24) return `${diffInHours} soat oldin`;
   if (diffInHours < 48) return 'Kecha';
   return date.toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' });
};

export const getCategoryStyle = (index: number) => {
   const styles = [
      { bg: 'bg-indigo-100', text: 'text-indigo-700' },
      { bg: 'bg-emerald-100', text: 'text-emerald-700' },
      { bg: 'bg-orange-100', text: 'text-orange-700' },
      { bg: 'bg-rose-100', text: 'text-rose-700' },
      { bg: 'bg-cyan-100', text: 'text-cyan-700' },
   ];
   return styles[index % styles.length];
};
