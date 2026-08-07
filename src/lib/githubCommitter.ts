const OWNER = "KloudEra-Technologies";
const REPO = "kloudera-website";
const BRANCH = "main";

export async function commitToGithub(filePath: string, contentBuffer: Buffer, message: string) {
  const token = process.env.GITHUB_PAT;
  if (!token) {
    console.warn("GITHUB_PAT is not set. Skipping GitHub commit.");
    return { success: false, message: "GITHUB_PAT env variable is missing" };
  }

  // Normalize path format for GitHub (e.g. public/partners/Microsoft.png)
  const githubPath = filePath.replace(/\\/g, "/").replace(/^\.\//, "").replace(/^\//, "");
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${githubPath}`;

  try {
    // 1. Check if file exists to get its SHA
    let sha: string | undefined;
    const getRes = await fetch(`${url}?ref=${BRANCH}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Kloudera-App"
      }
    });

    if (getRes.ok) {
      const getJson: any = await getRes.json();
      sha = getJson.sha;
    }

    // 2. Perform the PUT request
    const putRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "Kloudera-App"
      },
      body: JSON.stringify({
        message,
        content: contentBuffer.toString("base64"),
        branch: BRANCH,
        sha
      })
    });

    if (!putRes.ok) {
      const errorText = await putRes.text();
      console.error(`GitHub API upload failed for ${githubPath}:`, errorText);
      return { success: false, error: errorText };
    }

    console.log(`Successfully committed ${githubPath} to GitHub!`);
    return { success: true };
  } catch (err: any) {
    console.error(`Error committing ${githubPath} to GitHub:`, err);
    return { success: false, error: err.message };
  }
}
