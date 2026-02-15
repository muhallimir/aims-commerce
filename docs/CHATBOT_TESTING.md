# AI Chatbot Testing Guide

Test the enhanced chatbot with these questions to verify its sophisticated responses.

## 🚚 Shipping & Delivery

| Question                        | Expected Response Type            |
| ------------------------------- | --------------------------------- |
| "How long does shipping take?"  | Shipping information with options |
| "Do you offer free shipping?"   | Shipping costs breakdown          |
| "How do I track my order?"      | Tracking instructions             |
| "Do you ship internationally?"  | International shipping info       |
| "What are your shipping costs?" | Detailed cost breakdown           |

### Test Commands:

```
How long does shipping take?
Is shipping free?
Track my order
Do you ship to Canada?
What's the shipping cost?
```

---

## ↩️ Returns & Refunds

| Question                               | Expected Response Type      |
| -------------------------------------- | --------------------------- |
| "What is your return policy?"          | Return policy details       |
| "How do I return an item?"             | Step-by-step return process |
| "Can I exchange for a different size?" | Exchange information        |
| "I received a damaged item"            | Damaged item resolution     |
| "How long for a refund?"               | Refund timeline             |

### Test Commands:

```
What's your return policy?
How do I return something?
I want to exchange my order
My item arrived broken
When will I get my refund?
```

---

## 💳 Payment & Checkout

| Question                              | Expected Response Type  |
| ------------------------------------- | ----------------------- |
| "What payment methods do you accept?" | Payment options list    |
| "Is my payment secure?"               | Security assurance      |
| "How do I use a promo code?"          | Promo code instructions |
| "Do you accept gift cards?"           | Gift card info          |
| "Can I pay with PayPal?"              | Payment methods         |

### Test Commands:

```
What payment methods do you accept?
Is my credit card safe?
How do I apply a discount code?
Can I use a gift card?
Do you take PayPal?
```

---

## 👤 Account Help

| Question                               | Expected Response Type      |
| -------------------------------------- | --------------------------- |
| "How do I create an account?"          | Registration steps          |
| "I forgot my password"                 | Password reset instructions |
| "What are the benefits of an account?" | Account benefits list       |
| "How do I update my profile?"          | Account help                |

### Test Commands:

```
How do I sign up?
I forgot my password
Why should I create an account?
How do I change my email?
```

---

## 📦 Order Status

| Question                           | Expected Response Type  |
| ---------------------------------- | ----------------------- |
| "Where is my order?"               | Order tracking guidance |
| "What does 'processing' mean?"     | Status explanations     |
| "Can I cancel my order?"           | Order modification info |
| "How do I check my order history?" | Order information       |

### Test Commands:

```
Where is my order?
What do the order statuses mean?
Can I change my order?
How do I see my past orders?
```

---

## 📏 Product Information

| Question                       | Expected Response Type |
| ------------------------------ | ---------------------- |
| "Do you have a size guide?"    | Sizing information     |
| "Are your products authentic?" | Quality guarantee      |
| "What's the warranty?"         | Warranty information   |
| "Is this product genuine?"     | Authenticity assurance |

### Test Commands:

```
What size should I get?
Are these products real?
What warranty do you offer?
How do I know it's authentic?
```

---

## 💬 Contact & Support

| Question                       | Expected Response Type |
| ------------------------------ | ---------------------- |
| "How do I contact support?"    | Contact options        |
| "Can I talk to a human?"       | Escalation option      |
| "What are your support hours?" | Support availability   |
| "I need help"                  | Help menu              |

### Test Commands:

```
How do I contact you?
I want to speak to a person
When is support available?
Help me
```

---

## 🏪 Seller Questions

| Question                       | Expected Response Type   |
| ------------------------------ | ------------------------ |
| "How do I become a seller?"    | Seller registration info |
| "Can I sell on your platform?" | Seller information       |
| "How do I list my products?"   | Seller guidance          |

### Test Commands:

```
How do I become a seller?
Can I sell my products here?
How do I start selling?
```

---

## 🛍️ Product Search

| Question                           | Expected Response Type  |
| ---------------------------------- | ----------------------- |
| "Show me laptops"                  | Product suggestions     |
| "I need a laptop under $1000"      | Price-filtered products |
| "What's trending?"                 | Popular products        |
| "Compare gaming laptops"           | Comparison products     |
| "Do you have any phones in stock?" | Availability check      |

### Test Commands:

```
Show me laptops
I want a laptop under $1000
What's popular right now?
Compare gaming laptops
Are there any phones available?
```

---

## 🙏 Pleasantries

| Question    | Expected Response Type |
| ----------- | ---------------------- |
| "Hello"     | Friendly greeting      |
| "Thank you" | Acknowledgment         |
| "Goodbye"   | Farewell message       |
| "Hi there!" | Welcome message        |

### Test Commands:

```
Hello
Thanks for your help
Bye!
Good morning
```

---

## 🧪 Edge Cases

Test these to verify robust handling:

```
asdfghjkl                    → Should offer help gracefully
laptop laptop laptop         → Should find laptops
WHAT IS YOUR RETURN POLICY?  → Case insensitive
how much is shipping???      → Handle punctuation
I want to return AND exchange → Multiple intents
```

---

## ✅ Expected Behaviors

1. **Formatted Responses**: Answers should use markdown with emojis, bold text, and bullet points
2. **Contextual Suggestions**: Quick-reply buttons relevant to the topic
3. **Graceful Fallbacks**: Unknown queries should offer helpful alternatives
4. **Product Integration**: Product searches should show interactive product cards
5. **Escalation Option**: Complex issues should offer human agent connection

---

## 📊 Success Criteria

- [ ] Shipping questions return detailed shipping info
- [ ] Return policy questions explain the process
- [ ] Payment questions list all options
- [ ] Account questions guide users properly
- [ ] Product searches return relevant products
- [ ] Price filters work correctly ($100-500, under $1000, etc.)
- [ ] Greetings feel natural and welcoming
- [ ] Unknown queries don't break the chat
- [ ] Suggestions are contextually relevant
- [ ] **Typing animation shows for new bot messages**
- [ ] **Popularity chart displays for popularity queries**

---

## 🔥 Popularity & Trending (NEW)

| Question                      | Expected Response Type                |
| ----------------------------- | ------------------------------------- |
| "What's popular right now?"   | Popularity chart + sorted products    |
| "Show me trending products"   | Popularity chart + products by rating |
| "What are your best sellers?" | Popularity chart + top-rated products |
| "Most popular electronics?"   | Category-specific popularity chart    |
| "Top rated items"             | Popularity ranking visualization      |
| "What are people buying?"     | Trending products with visual chart   |

### Test Commands:

```
What's popular?
Show me trending products
What are your best sellers?
Most popular electronics
Top rated clothing
What's hot right now?
What are people buying?
Best rated products
```

### Expected Behaviors:

1. **Popularity Chart**: Mini horizontal bar chart showing top 5 products by rating
2. **Ranked Display**: Products sorted from highest to lowest rating
3. **Visual Indicators**: Gold/Silver/Bronze badges for top 3 positions
4. **Hover Tooltips**: Product details on hover
5. **Animated Bars**: Bars grow with animation on display

---

## 💰 Cheapest & Most Expensive (NEW)

| Question                           | Expected Response Type                |
| ---------------------------------- | ------------------------------------- |
| "What's your cheapest product?"    | Budget deals sorted low to high       |
| "Show me the most expensive items" | Premium collection sorted high to low |
| "Cheapest electronics?"            | Category-specific budget options      |
| "Most expensive clothing?"         | Category-specific premium items       |
| "Budget friendly options"          | Affordable products                   |
| "Show me luxury items"             | High-end premium products             |

### Test Commands:

```
What's your cheapest?
Show me the most expensive
Cheapest laptops
Most expensive phones
Budget friendly options
Show me luxury items
What's the least expensive?
Premium products
Bargain deals
Most affordable clothing
```

### Expected Behaviors:

1. **Cheapest**: Products sorted from lowest to highest price
2. **Most Expensive**: Products sorted from highest to lowest price
3. **Category Specific**: "Cheapest electronics" filters by category
4. **Price Range Display**: Shows price range of results
5. **Relevant Suggestions**: Budget queries suggest premium, premium suggests budget
6. **Empty Handling**: Shows trending products if category is empty

---

## ⌨️ Typing Animation (NEW)

### Verification Steps:

1. **Send any message** to the chatbot
2. **Observe the bot response** - text should appear character by character
3. **Blinking cursor** should show during typing animation
4. **Animation speed** is approximately 100 characters/second (fast but readable)
5. **After completion** - cursor disappears, products/suggestions appear

### Test Commands:

```
Hello there!                    → Short message, quick animation
What is your shipping policy?   → Longer response, noticeable typing effect
Show me popular products        → Text animation, then chart + products appear
```

### Expected Behaviors:

1. **Character-by-character reveal** for bot messages
2. **Blinking cursor** at end of text during animation
3. **Smooth animation** without stuttering
4. **Products/suggestions** appear after text completes

---

## 🎁 Deals & Promotions (NEW)

| Question                   | Expected Response Type |
| -------------------------- | ---------------------- |
| "Are there any deals?"     | Current promotions     |
| "Do you have sales?"       | Sale information       |
| "Any discounts available?" | Discount information   |
| "What's on special?"       | Special offers         |

### Test Commands:

```
Are there any deals?
Do you have sales right now?
What discounts do you offer?
Any special offers?
```

---

## ❤️ Wishlist (NEW)

| Question                | Expected Response Type |
| ----------------------- | ---------------------- |
| "How do I save items?"  | Wishlist instructions  |
| "Can I save for later?" | Save feature info      |
| "Where's my wishlist?"  | Wishlist location      |

### Test Commands:

```
How do I save items for later?
Where is my wishlist?
Can I bookmark products?
```

---

## 📦 Stock & Availability (NEW)

| Question                | Expected Response Type    |
| ----------------------- | ------------------------- |
| "Is this in stock?"     | Stock status info         |
| "When will it be back?" | Restock notification info |
| "Can you notify me?"    | Notification setup        |

### Test Commands:

```
Is this item in stock?
When will you restock?
Notify me when available
```

---

## ⭐ Loyalty & Rewards (NEW)

| Question                         | Expected Response Type |
| -------------------------------- | ---------------------- |
| "Do you have a rewards program?" | Loyalty program info   |
| "How do I earn points?"          | Points earning info    |
| "What's my VIP status?"          | Membership info        |

### Test Commands:

```
Do you have rewards?
How does the points system work?
What are the membership benefits?
```

---

## 📦 Bulk Orders (NEW)

| Question                  | Expected Response Type |
| ------------------------- | ---------------------- |
| "Do you offer wholesale?" | Bulk order info        |
| "Volume discounts?"       | Quantity pricing       |
| "Corporate orders?"       | Business account info  |

### Test Commands:

```
Do you do wholesale?
Can I get a bulk discount?
Business orders available?
```

---

## 🔐 Privacy & Security (NEW)

| Question                   | Expected Response Type |
| -------------------------- | ---------------------- |
| "Is my data safe?"         | Privacy assurance      |
| "How secure is this site?" | Security info          |
| "Privacy policy?"          | Privacy details        |

### Test Commands:

```
Is my information safe?
How secure are payments?
What's your privacy policy?
```

---

## 🛍️ Categories (NEW)

| Question                     | Expected Response Type |
| ---------------------------- | ---------------------- |
| "What do you sell?"          | Category listing       |
| "Show me all categories"     | Department overview    |
| "What sections do you have?" | Browse options         |

### Test Commands:

```
What categories do you have?
What do you sell?
Show me all departments
```

---

## 🔄 Empty State Handling (NEW)

When a category has no products:

### Test Commands:

```
Best rated clothing     → If no clothing, shows trending from all + alternatives
Most popular toys       → Shows message + trending products as fallback
Top gaming accessories  → Graceful fallback with suggestions
```

### Expected Behaviors:

1. **Category Empty**: Shows trending from ALL categories instead
2. **Helpful Message**: Explains no products in that category yet
3. **Alternative Suggestions**: Offers other categories to browse
4. **No Broken UI**: Never shows "browse categories" with empty list
5. **Fallback Products**: Always shows SOMETHING if products exist anywhere
