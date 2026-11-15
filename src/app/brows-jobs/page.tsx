const BrowseJobs = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const search = await searchParams;
  const url = new URLSearchParams(search as Record<string, string>);
  const query = url.toString();
  console.log('search params', query);

  return (
    <div>
      <p>Browse jobs</p>
    </div>
  );
};

export default BrowseJobs;
