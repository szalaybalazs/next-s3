export const configureDistribution = async (cloudfront: AWS.CloudFront, region: string, distribution: string) => {
  const config = await cloudfront.getDistribution({ Id: distribution }).promise();
  region;

  if (!config.Distribution) throw new Error('No distribution found');

  const eTag = config.ETag;
  const errorCodes = [400, 403, 404, 405, 414, 416, 500, 501, 502, 503, 504];
  const DistributionConfig = {
    ...config.Distribution?.DistributionConfig,
    CustomErrorResponses: {
      Quantity: errorCodes.length,
      Items: errorCodes.map((code) => ({
        ErrorCode: code,
        ResponsePagePath: '/404.html',
        ResponseCode: String(code),
        ErrorCachingMinTTL: 10,
      })),
    },
  };

  await cloudfront.updateDistribution({ Id: distribution, IfMatch: eTag, DistributionConfig }).promise();
};

export const invalidate = async (cloudfront: AWS.CloudFront, distribution: string) => {
  const batch = { CallerReference: `${Date.now()}`, Paths: { Quantity: 1, Items: ['/*'] } };
  await cloudfront.createInvalidation({ DistributionId: distribution, InvalidationBatch: batch }).promise();
};
