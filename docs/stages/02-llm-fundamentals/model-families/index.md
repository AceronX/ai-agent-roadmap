
# Model-families and Licences 

Model Families and Licenses are two important concepts when working with AI models.

## 1. What Are Model Families?

A model family is a group of related AI models built from the same architecture and training approach but released in different sizes, versions, or capabilities.
### Open Weight Models
Open-weight models are neural networks whose trained parameters, also called weights, are shared with everyone. Anyone can download the files, run the model, fine-tune it, or build tools on top of it. The licence that comes with the model spells out what you are allowed to do. Some licences are very permissive and even let you use the model for commercial work. Others allow only research or personal projects. Because the weights are public, the community can inspect how the model works, check for bias, and suggest fixes. Open weights also lower costs, since teams do not have to train a large model from scratch. Well-known examples include BLOOM, Falcon, and Llama 2.
### Closed Weight Models
Closed-weight models are AI systems whose trained parameters—the numbers that hold what the model has learned—are not shared with the public. You can send prompts to these models through an online service or a software kit, but you cannot download the weights, inspect them, or fine-tune them on your own computer. The company that owns the model keeps control and sets the rules for use, often through paid APIs or tight licences. This approach helps the owner protect trade secrets, reduce misuse, and keep a steady income stream. The downside is less freedom for users, higher costs over time, and limited ability to audit or adapt the model. Well-known examples include GPT-4, Claude, and Gemini.

## 2. What Are Licenses?

A license defines what you are legally allowed to do with a model.

It answers questions such as:

Can I use it commercially?
Can I modify it?
Can I redistribute it?
Can I train my own version?
Do I need to share my changes?
Common License Types
Open Source Licenses
MIT License

Very permissive.

You can:

✅ Use commercially

✅ Modify

✅ Redistribute

✅ Build products

Example:

Many AI tools and libraries use the MIT license.

Apache 2.0 License

Also permissive.

You can:

✅ Commercial use

✅ Modification

✅ Redistribution

✅ Patent protection

Many companies prefer Apache 2.0.

Copyleft Licenses
GPL License

You can modify and distribute.

However:

If you distribute modified versions,
You must release your source code.

This is called copyleft.
---
Custom AI Licenses

Many AI models are not truly open source.

For example:

Meta AI models often use custom licenses.
Some commercial providers impose additional restrictions on redistribution or large-scale deployment.

Always read the model's specific license before using it in a product.


## Simple Summary

Model Family
= A collection of related models built from the same technology.

Examples:

GPT family
Llama family
Mistral family

License
= The legal rules governing how you can use the model.

Examples:

MIT
Apache 2.0
GPL
Proprietary
Custom AI licenses