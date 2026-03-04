import argparse
import json

parser = argparse.ArgumentParser()
parser.add_argument("followers_file")
parser.add_argument("following_file")
args = parser.parse_args()

with open(args.followers_file) as f:
    followers_data = json.load(f)

with open(args.following_file) as f:
    following_data = json.load(f)
#print(type(followers_data))
#print(type(following_data))

def parse(following, followers):
    return list(set(following) - set(followers))
def extract_following(data):
    res = []
    for entry in data["relationships_following"]:
        username = entry["title"]
        res.append(username)
    return res
def extract_followers(data):
    result = []
    for entry in data:
        username = entry["string_list_data"][0]["value"]
        result.append(username)
    return result

follower_list = extract_followers(followers_data)
following_list = extract_following(following_data)
final_list = parse(following_list, follower_list)
print(final_list)
print(f"\nTotal not following back: {len(final_list)}")
for i in final_list:
    assert i in following_list, "error found"

