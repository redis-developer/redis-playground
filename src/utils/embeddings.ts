import { OpenAIEmbeddings } from "@langchain/openai";

const getOpenAIEmbedder = () => {
  // following OpenAIEmbeddings are used for datasets like src/data/data-sources/sts-dev-ds/ (Semantic Textual Similarity Development set)
  const embedder = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  return embedder;
};

const convertTextToEmbeddings = async (text: string) => {
  const embedder = getOpenAIEmbedder();
  const embeddings = await embedder.embedQuery(text);
  return embeddings;
};

export { getOpenAIEmbedder, convertTextToEmbeddings };
