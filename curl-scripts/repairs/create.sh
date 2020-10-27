
API="http://localhost:4741"
URL_PATH="/repairs"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "repair": {
      "date": "'"${DATE}"'",
      "type": "'"${TYPE}"'",
      "price": "'"${PRICE}"'"
    }
  }'

echo
